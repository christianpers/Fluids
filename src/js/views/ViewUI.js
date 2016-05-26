import View from "../framework/View";
import Mesh from "../framework/Mesh";

export default class ViewUI extends View {

	constructor(transforms) {

		super(transforms, require("../../shaders/cal.vert"), require("../../shaders/UI.frag"));


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

	render(mouseCoords) {

		// this.transforms.push();

		this.shader.bind();

		// this.shader.uniform("uWinW", "uniform1i", window.innerWidth);
		// this.shader.uniform("uWinH", "uniform1i", window.innerHeight);

		this.shader.uniform("mouseX", "uniform1f", mouseCoords[0]);
		this.shader.uniform("mouseY", "uniform1f", mouseCoords[1]);

	
		this.draw(this.mesh);

		// this.transforms.pop();
	}
}
