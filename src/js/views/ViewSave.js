import View from "../framework/View";
import Mesh from "../framework/Mesh";

export default class ViewSave extends View {

	constructor(transforms) {

		super(transforms, require("../../shaders/save.vert"), require("../../shaders/save.frag"));

		var positions = [];
		var coords = [];
		var indices = [];
		var colors = [];

		
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
				// colors.push( this.pointData[index] );
				colors.push([.5, .5, .5]);


				x += step;
				index++;

			}

			y -= step;
		}

		this.mesh = new Mesh(positions.length, indices.length, this.gl.POINTS);
		this.mesh.bufferVertex(positions);
		this.mesh.bufferIndices(indices);
		this.mesh.bufferData(colors, "aVertexColor", 3);
	}

	render() {

		// this.transforms.push();

		this.shader.bind();

		this.draw(this.mesh);

		// this.transforms.pop();
	}
}
