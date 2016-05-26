import View from "../framework/View";
import Mesh from "../framework/Mesh";

export default class ViewParticles extends View {

	constructor(transforms) {

		super(transforms, require("../../shaders/particles.vert"), require("../../shaders/particles.frag"));

		var positions = [];
		var coords = [];
		var indices = [];
		// var colors = [];

		var detail = window.NS.GL.params.detail;
		var totDetail = detail * detail;
		
		var index = 0;
		
		var y = 1 - (2 / (detail * 2));
		var step = 2 / detail;

		for (var row=0;row<detail;row++){
			
			var x = -1 + (2 / (detail * 2));
			for (var col=0;col<detail;col++){

				positions.push([x, y, 0]);
				indices.push(index);
				coords.push([col/detail, 1.0 - (row/detail)]);
				
				x += step;
				index++;

			}

			y -= step;
		}
		
	
		this.mesh = new Mesh(positions.length, indices.length, this.gl.POINTS);
		this.mesh.bufferVertex(positions);
		this.mesh.bufferIndices(indices);
		this.mesh.bufferTexCoords(coords);
		// this.mesh.bufferData(colors, "aVertexColor", 3);

		// var positions = [];
		// var coords = [];
		// var indices = [0, 1, 2, 0, 2, 3];
		

		// var size = 1;
		// positions.push([-size, -size, 0]);
		// positions.push([ size, -size, 0]);
		// positions.push([ size,  size, 0]);
		// positions.push([-size,  size, 0]);

		// coords.push([0, 0]);
		// coords.push([1, 0]);
		// coords.push([1, 1]);
		// coords.push([0, 1]);

		// // debugger;
		// this.mesh = new Mesh(positions.length, indices.length, this.gl.TRIANGLES);
		// this.mesh.bufferVertex(positions);
		// this.mesh.bufferTexCoords(coords);
		// this.mesh.bufferIndices(indices);
	}


	render(texture) {

		// this.transforms.push();

		this.shader.bind();

		this.shader.uniform("uDens", "uniform1i", 0);
		texture.bind(this.shader, 0);

		this.draw(this.mesh);

		// this.transforms.pop();
	}
}
