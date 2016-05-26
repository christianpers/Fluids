import View from "../framework/View";
import Mesh from "../framework/Mesh";

export default class ViewAddSource extends View {

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

	render(x, s, dt, multiplier) {

		// this.transforms.push();

		this.shader.bind();

		this.shader.uniform("uN", "uniform1i", window.NS.GL.params.details-2);

		this.shader.uniform("uX", "uniform1i", 0);
		x.bind(this.shader, 0);

		this.shader.uniform("uS", "uniform1i", 1);
		s.bind(this.shader, 1);

		this.shader.uniform("uDt", "uniform1f", dt);

		this.shader.uniform("multiplier", "uniform1f", multiplier);
		
		this.draw(this.mesh);

		// this.transforms.pop();
	}
}
