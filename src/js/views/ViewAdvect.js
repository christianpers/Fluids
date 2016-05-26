import View from "../framework/View";
import Mesh from "../framework/Mesh";

export default class ViewAdvect extends View {

	constructor(transforms, frag) {

		super(transforms, require("../../shaders/cal.vert"), frag);

		var positions = [];
		var coords = [];
		var indices = [0, 1, 2, 0, 2, 3];

		positions.push([-1,	-1,  0]);
		positions.push([ 1,	-1,  0]);
		positions.push([ 1,	 1,  0]);
		positions.push([-1,	 1,  0]);

		coords.push([0, 0]);
		coords.push([1, 0]);
		coords.push([1, 1]);
		coords.push([0, 1]);

		this.mesh = new Mesh(positions.length, indices.length, this.gl.TRIANGLES);
		this.mesh.bufferVertex(positions);
		this.mesh.bufferTexCoords(coords);
		this.mesh.bufferIndices(indices);
	}

	render(N, b, d, d0, vel, dt, multiplier) {

		// this.transforms.push();

		this.shader.bind();

		this.shader.uniform("uD", "uniform1i", 0);
		this.shader.uniform("uD0", "uniform1i", 1);
		this.shader.uniform("uVel", "uniform1i", 2);
		
		d.bind(this.shader, 0);
		d0.bind(this.shader, 1);
		vel.bind(this.shader, 2);
		
		this.shader.uniform("uN", "uniform1i", N);
		this.shader.uniform("uB", "uniform1i", b);
		this.shader.uniform("uDt", "uniform1f", dt);
		this.shader.uniform("multiplier", "uniform1f", multiplier);
		// this.shader.uniform("uWinW", "uniform1f", window.innerWidth);
		// this.shader.uniform("uWinH", "uniform1f", window.innerHeight);
		
		this.draw(this.mesh);

		// this.transforms.pop();
	}
}
