import Scene from "./framework/Scene";
import ViewSave from "./views/ViewSave";
import ViewCopy from "./views/ViewCopy";
import ViewAddSource from "./views/ViewAddSource";
import ViewDiffuse from "./views/ViewDiffuse";
import ViewAdvect from "./views/ViewAdvect";
import ViewAdvectVel from "./views/ViewAdvectVel";
import ViewProject from "./views/ViewProject";
import ViewUI from "./views/ViewUI";
import ViewUIVel from "./views/ViewUIVel";
// import ViewSetBnd from "./views/ViewSetBnd";

import ViewParticles from "./views/ViewParticles";
import MouseInteractor from "./framework/MouseInteractor";
import KeyboardInteractor from "./framework/KeyboardInteractor";
import SceneTransforms from "./framework/SceneTransforms";
import Framebuffer from "./framework/Framebuffer";
import Texture from "./framework/Texture";

export default class SceneMain extends Scene {
	constructor() {

		super();
		this.onResize();
		window.addEventListener('resize', () => {
			this.onResize();
		});

		this.mouseIsDown = false;

		document.addEventListener('mousedown', (e) => {

			this.mouseIsDown = true;
			this.mouseCoords[0] = e.x/window.innerWidth;
			this.mouseCoords[1] = e.y/window.innerHeight;
		});

		document.addEventListener('mouseup', (e) => {

			this.mouseIsDown = false;
		});

		this.lastMouseCoords = [0,0];
		this.mouseCoords = [0,0];
		
		document.addEventListener('mousemove', (e) => {

			if (!this.mouseIsDown) return;
			this.mouseCoords[0] = e.x/window.innerWidth;
			this.mouseCoords[1] = e.y/window.innerHeight;

		});

		this._hasSaved = false;
	
		this.camera.setPosition(new Array(0.0, 0.0, 0.0));
		this.camera.setLookAtPoint(vec3.fromValues(0.0, 0.0, 1.0));

		this.mouseInteractor = new MouseInteractor(this.camera, this.canvas);
		this.mouseInteractor.setup();

		this.keyboardInteractor = new KeyboardInteractor(this.camera, this.canvas);
		this.keyboardInteractor.setup();

		this.transforms = new SceneTransforms(this.canvas);

		this.orthoTransforms = new SceneTransforms(this.canvas);


		this.initTextures();
		this.initViews();

		//GUI VARS
		this.currentVelFBO = this.velFBO; 
		this.showVelSource = 0;
		this.showVelDiffuse = 0;
		this.showVelAdvect = 0;
		this.showVelProject = 0;

		this.currentDensFBO = this.densFBO;
		this.showDensSource = 0;
		this.showDensDiffuse = 0;
		this.showDensAdvect = 0;

		this.velMultiplier = 5;
		this.densMultiplier = 100;
		this.dt = 0.9;
		this.diff = 0.00075;
		this.visc = 0.00075;

	
		var gui = new dat.GUI();
		var steps = gui.addFolder('Show Steps');
		steps.add(this, 'showVelSource', false);
		steps.add(this, 'showVelDiffuse', false);
		steps.add(this, 'showVelAdvect', false);
		steps.add(this, 'showVelProject', false);
		steps.add(this, 'showDensSource', false);
		steps.add(this, 'showDensDiffuse', false);
		steps.add(this, 'showDensAdvect', false);

 		var FBOs = gui.addFolder('FBOs');
		FBOs.add(this, 'currentVelFBO', ['vVelFBO', 'uVelFBO', 'vHistVelFBO', 'uHistVelFBO']).onChange(this.onGUIFBOUpdate.bind(this));
		FBOs.add(this, 'currentDensFBO', ['densFBO', 'densHistFBO']).onChange(this.onGUIFBOUpdate.bind(this));
		
		var uniforms = gui.addFolder('Shader uniforms');
		uniforms.add(this, 'densMultiplier', 2, 200);
		uniforms.add(this, 'velMultiplier', 2, 200);
		uniforms.add(this, 'dt', 0.00001, 20);
		uniforms.add(this, 'diff', 0.000001, 0.1);
		uniforms.add(this, 'visc', 0.000001, 0.1);
		
	}

	onGUIFBOUpdate(val) {

		if (val == 'vVelFBO')
			this.currentVelFBO = this.vVelFBO;
		else if (val == 'uVelFBO')
			this.currentVelFBO = this.uVelFBO;
		else if (val == 'vHistVelFBO')
			this.currentVelFBO = this.vHistVelFBO;
		else if (val == 'uHistVelFBO')
			this.currentVelFBO = this.uHistVelFBO;
		else if (val == 'densFBO')
			this.currentDensFBO = this.densFBO;
		else if (val == 'densHistFBO')
			this.currentDensFBO = this.densHistFBO;

	}

	initTextures() {
	
		var N = window.NS.GL.params.detail - 2;

		var size = N + 2;

		this.altFBO = new Framebuffer(size, size, this.gl.NEAREST, this.gl.NEAREST, this.gl.FLOAT);
	
		this.velFBO = new Framebuffer(size, size, this.gl.NEAREST, this.gl.NEAREST, this.gl.FLOAT);
		this.velHistFBO = new Framebuffer(size, size, this.gl.NEAREST, this.gl.NEAREST, this.gl.FLOAT);

		this.densFBO = new Framebuffer(size, size, this.gl.NEAREST, this.gl.NEAREST, this.gl.FLOAT);
		this.densFBO.id = 'densFBO';
		this.densHistFBO = new Framebuffer(size, size, this.gl.NEAREST, this.gl.NEAREST, this.gl.FLOAT);
		this.densHistFBO.id = 'densHistFBO';

	}

	initViews() {

		this.vSave = new ViewSave(this.orthoTransforms);

		this.vCopy = new ViewCopy(this.orthoTransforms, require("../shaders/copy.frag"));
		this.vCopyMultipler = new ViewCopy(this.orthoTransforms, require("../shaders/copyMultiplier.frag"))

		this._vAddSource = new ViewAddSource(this.orthoTransforms, require("../shaders/addSource.frag"));
		this._vAddSourceVel = new ViewAddSource(this.orthoTransforms, require("../shaders/addSourceVel.frag"));

		this._vDiffuse = new ViewDiffuse(this.orthoTransforms, require("../shaders/diffuse.frag"));
		this._vDiffuseVel = new ViewDiffuse(this.orthoTransforms, require("../shaders/diffuseVel.frag"));

		this._vUI = new ViewUI(this.orthoTransforms);

		this._vUIVel = new ViewUIVel(this.orthoTransforms);

		this._vProjectOne = new ViewProject(this.orthoTransforms, require("../shaders/projectOne.frag"));
		this._vProjectTwo = new ViewProject(this.orthoTransforms, require("../shaders/projectTwo.frag"));
		this._vProjectThree = new ViewProject(this.orthoTransforms, require("../shaders/projectThree.frag"));

		// this._vSetBnd = new ViewSetBnd(this.orthoTransforms);

		this._vAdvect = new ViewAdvect(this.orthoTransforms, require("../shaders/advect.frag"));
		this._vAdvectVel = new ViewAdvectVel(this.orthoTransforms, require("../shaders/advectVel.frag"));

		this._vParticles = new ViewParticles(this.orthoTransforms);

	
	}

	update() {

		super.update();

	}

	render() {

	
		this.orthoTransforms.setCamera(this.orthoCamera);

		var clearColor = .5;

		if (!this._hasSaved){

			this.gl.viewport(0,0,this.densFBO.width, this.densFBO.height);
		
			this.densFBO.bind();
			this.gl.clearColor( clearColor, clearColor, clearColor, 1 );
			this.gl.clear(this.gl.COLOR_BUFFER_BIT);

			this.vSave.render();

			this.densFBO.unbind();

			this.densHistFBO.bind();
			this.gl.clearColor( clearColor, clearColor, clearColor, 1 );
			this.gl.clear(this.gl.COLOR_BUFFER_BIT);

			this.vSave.render();

			this.densHistFBO.unbind();

			this.velFBO.bind();
			this.gl.clearColor( 0.5, 0.5, 0.5, 1 );
			this.gl.clear(this.gl.COLOR_BUFFER_BIT);

			this.vSave.render();

			this.velFBO.unbind();

			this.velHistFBO.bind();
			this.gl.clearColor( 0.5, 0.5, 0.5, 1 );
			this.gl.clear(this.gl.COLOR_BUFFER_BIT);

			this.vSave.render();

			this.velHistFBO.unbind();

			this.altFBO.bind();
			this.gl.clearColor( 0, 0, 0, 1 );
			this.gl.clear(this.gl.COLOR_BUFFER_BIT);

			this.vSave.render();

			this.altFBO.unbind();

			this._hasSaved = true;
		}

		this.gl.viewport(0,0,this.altFBO.width, this.altFBO.height);

		// ----- CLEAR HIST FBO -----
		this.densHistFBO.bind();
		this.gl.clearColor( clearColor, clearColor, clearColor, 1 );
		this.gl.clear(this.gl.COLOR_BUFFER_BIT);
		// this.vSave.render();
		this.densHistFBO.unbind();

		this.velHistFBO.bind();
		this.gl.clearColor( clearColor, clearColor, clearColor, 1 );
		this.gl.clear(this.gl.COLOR_BUFFER_BIT);
		// this.vSave.render();
		this.velHistFBO.unbind();
		// ----------------------------
		


		// --- DEFINE VARS --------
		var dt = this.dt;
		var N = window.NS.GL.params.detail - 2;
		var diff = this.diff;
		var visc = this.visc;
		// var source = 100;
		// var force = 5.0;
		//--------------------------



		// --- VELOCITY RENDER ----
		this.get_from_UI_Vel(this.velHistFBO);
		this.add_source_vel(N, this.velFBO, this.velHistFBO, dt, this.velMultiplier);

		// if (this.showVelSource){
		// 	this.renderToCopy(this.velFBO.getTexture());
		// 	return;
		// }

		

		this.swapFbosVel();
		this.diffuse_vel(N, 1, this.velFBO, this.velHistFBO, visc, dt, this.velMultiplier);

		this.renderToCopy(this.velFBO.getTexture());
		// return;


		// this.project(N, this.velFBO, this.velHistFBO, this.velMultiplier);

		

		this.swapFbosVel();


	
		// if (this.showVelDiffuse){
		// 	this.renderToCopy(this.currentVelFBO.getTexture());
		// 	return;
		// }

		// this.advect_vel(N, 1, this.velFBO, this.velHistFBO);
		// // this.advect(N, 1, this.uVelFBO, this.uHistVelFBO, this.uHistVelFBO, this.vHistVelFBO, dt, this.velMultiplier);
		// // this.advect(N, 2, this.vVelFBO, this.vHistVelFBO, this.uHistVelFBO, this.vHistVelFBO, dt, this.velMultiplier);

		// if (this.showVelAdvect){
		// 	this.renderToCopy(this.currentVelFBO.getTexture());
		// 	return;
		// }

		// this.project(N, this.velFBO, this.velHistFBO, this.velMultiplier);

		// if (this.showVelProject){
		// 	this.renderToCopy(this.currentVelFBO.getTexture());
		// 	return;
		// }
		// // ------------------------


		// // ---- DENSITY RENDER -----
		// this.get_from_UI(this.densHistFBO);

		// this.add_source(N, this.densFBO, this.densHistFBO, dt, this.densMultiplier);

		// if (this.showDensSource){
		// 	this.renderToCopy(this.currentDensFBO.getTexture());
		// 	return;
		// }

		// this.swapFbosDens();

		// this.diffuse(N, 0, this.densFBO, this.densHistFBO, diff, dt, this.densMultiplier);

		// this.swapFbosDens();

		// if (this.showDensDiffuse){
		// 	this.renderToCopy(this.currentDensFBO.getTexture());
		// 	return;
		// }
	
		// this.advect(N, 0, this.densFBO, this.densHistFBO, this.velFBO, dt, this.densMultiplier);

		// if (this.showDensAdvect){
		// 	this.renderToCopy(this.currentDensFBO.getTexture());
		// 	return;
		// }
		//-------------------------


		//--- PARTICLES RENDER ----

		// this.renderToCopyMultiplier(this.densFBO.getTexture());

		// this.gl.viewport(0, 0, this.gl.viewportWidth, this.gl.viewportHeight);

		// this.gl.clearColor( 0, 0, 0, 1 );
		// this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

		// this._vParticles.render(this.densFBO.getTexture());

	}

	renderToCopyMultiplier(texture){


		this.gl.viewport(0, 0, this.gl.viewportWidth, this.gl.viewportHeight);

		this.gl.clearColor( 0, 0, 0, 1 );
		this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

		this.vCopyMultipler.render(texture);

	}

	renderToCopy(texture){

		this.gl.viewport(0, 0, this.gl.viewportWidth, this.gl.viewportHeight);

		this.gl.clearColor( 0, 0, 0, 1 );
		this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

		this.vCopy.render(texture);

	}

	get_from_UI(d){

		d.bind();
		this._vUI.render(this.mouseCoords);
		d.unbind();
		
	}

	get_from_UI_Vel(velHist){

		velHist.bind();
		this._vUIVel.render(this.mouseCoords, this.lastMouseCoords);
		velHist.unbind();

		this.lastMouseCoords = this.mouseCoords.slice();
	}

	add_source(N, x, s, dt, mult) {

		this.altFBO.bind();
		this._vAddSource.render(x.getTexture(), s.getTexture(), dt, mult);
		this.altFBO.unbind();
		x.bind();
		this.vCopy.render(this.altFBO.getTexture());
		x.unbind();

	}

	add_source_vel(N, x, s, dt, mult) {

		this.altFBO.bind();
		this._vAddSourceVel.render(x.getTexture(), s.getTexture(), dt, mult);
		this.altFBO.unbind();
		x.bind();
		this.vCopy.render(this.altFBO.getTexture());
		x.unbind();

	}

	diffuse_vel(N, b, x, x0, diff, dt, mult) {

		for (var i=0;i<20;i++){
			this.altFBO.bind();

			this._vDiffuseVel.render(N, b, x.getTexture(), x0.getTexture(), diff, dt, mult);

			this.altFBO.unbind();

			x.bind();

			this.vCopy.render(this.altFBO.getTexture());

			x.unbind();
		}
	}

	diffuse(N, b, x, x0, diff, dt, mult) {

		for (var i=0;i<20;i++){
			this.altFBO.bind();

			this._vDiffuse.render(N, b, x.getTexture(), x0.getTexture(), diff, dt, mult);

			this.altFBO.unbind();

			x.bind();

			this.vCopy.render(this.altFBO.getTexture());

			x.unbind();
		}
	}

	

	advect_vel(N, b, d, d0, dt, mult) {
	
		this.altFBO.bind();
		this._vAdvectVel.render(N, b, d.getTexture(), d0.getTexture(), dt, mult);
		this.altFBO.unbind();
		d.bind();
		this.vCopy.render(this.altFBO.getTexture());
		d.unbind();
	}

	advect(N, b, d, d0, vel, dt, mult) {

		this.altFBO.bind();
		this._vAdvect.render(N, b, d.getTexture(), d0.getTexture(), vel.getTexture(), dt, mult);
		this.altFBO.unbind();
		d.bind();
		this.vCopy.render(this.altFBO.getTexture());
		d.unbind();
	}

	project(N, vel, velHist, mult) {

		/*
	
			vel.r = horizontal (u)
			vel.g = vertical (v)

			velHist.r = div
			velHist.g = p


		*/
	
		//first run
		this.altFBO.bind();
		this._vProjectOne.render(N, vel.getTexture(), velHist.getTexture(), mult);
		this.altFBO.unbind();
		velHist.bind();
		this.vCopy.render(this.altFBO.getTexture());
		velHist.unbind();

		//second run
		for (var i=0;i<20;i++){
			this.altFBO.bind();
			this._vProjectTwo.render(N, vel.getTexture(), velHist.getTexture(), mult);
			this.altFBO.unbind();
			velHist.bind();
			this.vCopy.render(this.altFBO.getTexture());
			velHist.unbind();
		}

		//third run
		this.altFBO.bind();
		this._vProjectThree.render(N, vel.getTexture(), velHist.getTexture(), mult);
		this.altFBO.unbind();
		vel.bind();
		this.vCopy.render(this.altFBO.getTexture());
		vel.unbind();
	
	}

	set_bnd(N, b, x){


		this.altFBO.bind();

		this._vSetBnd.render(N, b, x.getTexture());

		this.altFBO.unbind();

		x.bind();

		this.vCopy.render(this.altFBO.getTexture());

		x.unbind();

	}

	// swapFbosVelV(){

	// 	var tmp = this.vHistVelFBO;
	// 	this.vHistVelFBO = this.vVelFBO;
	// 	this.vVelFBO = tmp;
	// }

	swapFbosVel(){

		var tmp = this.velHistFBO;
		this.velHistFBO = this.velFBO;
		this.velFBO = tmp;
	}

	swapFbosDens(){

		var tmp = this.densHistFBO;
		this.densHistFBO = this.densFBO;
		this.densFBO = tmp;
	}

}