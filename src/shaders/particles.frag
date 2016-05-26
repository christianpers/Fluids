precision highp float;

uniform sampler2D uDens;

varying vec2 vTextureCoord;

void main() {

	

	vec3 textureColor = texture2D(uDens, vTextureCoord).rgb - vec3(.5);

	// if (textureColor.r >= .1)
	textureColor *= vec3(.9, .9, .9);

	



	gl_FragColor = vec4(textureColor, 1.0);
}
