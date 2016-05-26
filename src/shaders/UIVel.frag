precision highp float;


uniform float mouseX;
uniform float mouseY;

uniform float lastMouseX;
uniform float lastMouseY;

uniform float mousePosAxis;
uniform float lastMousePosAxis;

uniform int isX;


varying vec2 vTextureCoord;

void main(void) {
	vec3 color = vec3(0.5, 0.5, 0.5);

	float distToCenter = distance(vTextureCoord, vec2(mouseX, 1.0 - mouseY));

	if (distToCenter < 0.015){
		color.r = (mouseX - lastMouseX) + .5;
		color.g = (lastMouseY - mouseY) + .5;
	}
	
    gl_FragColor = vec4(color, 1.0);

}