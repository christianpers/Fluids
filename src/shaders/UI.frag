precision highp float;


uniform float mouseX;
uniform float mouseY;


varying vec2 vTextureCoord;

void main(void) {
	vec3 color = vec3(0.5, 0.5, 0.5);

	float distToCenter = distance(vTextureCoord, vec2(mouseX, 1.0 - mouseY));

	if (distToCenter < 0.015){
		color.r = 1.0;
	}
	// color.r = smoothstep(0.0, 0.02, distToCenter);
	// color.g = 0.5;
	// color.b = 0.5;

	
	// color -= vec3(.5);

    gl_FragColor = vec4(color, 1.0);

}