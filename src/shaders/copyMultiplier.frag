precision mediump float;
varying vec2 vTextureCoord;
uniform sampler2D uTexturePos;

void main(void) {
	vec3 color = texture2D(uTexturePos, vec2(vTextureCoord.s, vTextureCoord.t)).rgb;

	color -= vec3(.5);

	vec3 colorMult = vec3(1.0, 2.0, 2.0);
	color *= colorMult;

    gl_FragColor = vec4(color, 1.0);
    // gl_FragColor = vec4(0.0, 0.8, 0.0, 1.0);
}