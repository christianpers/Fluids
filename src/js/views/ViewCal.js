import View from "../framework/View";
import Mesh from "../framework/Mesh";

export default class ViewCal extends View {

	constructor(transforms) {

		super();

		// super(transforms, require("../../shaders/cal.vert"), require("../../shaders/cal_new.frag"));

		var positions = [];
		// var coords = [];
		// var indices = [0, 1, 2, 0, 2, 3];

		// positions.push([-1,	-1,  0]);
		// positions.push([ 1,	-1,  0]);
		// positions.push([ 1,	 1,  0]);
		// positions.push([-1,	 1,  0]);

		// coords.push([0, 0]);
		// coords.push([1, 0]);
		// coords.push([1, 1]);
		// coords.push([0, 1]);

		// this.mesh = new Mesh(positions.length, indices.length, this.gl.TRIANGLES);
		// this.mesh.bufferVertex(positions);
		// this.mesh.bufferTexCoords(coords);
		// this.mesh.bufferIndices(indices);
	}

	render() {

		// this.transforms.push();

		// this.shader.bind();
		
		// this.draw(this.mesh);

		// this.transforms.pop();
	}
}
