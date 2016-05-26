precision highp float;

uniform sampler2D uX;
uniform sampler2D uS;

uniform int uN;
uniform float uDt;
uniform float multiplier;

varying vec2 vTextureCoord;

void main(void) {

	// r = horizontal, g = vertical

	// float multiplier = 2.0;
	float normalizer = 0.5;

	float sourceColorH = (texture2D(uS, vTextureCoord).r - normalizer ) * multiplier;
	float targetColorH = (texture2D(uX, vTextureCoord).r - normalizer ) * multiplier;
	targetColorH += uDt * sourceColorH;

	float sourceColorV = (texture2D(uS, vTextureCoord).g - normalizer ) * multiplier;
	float targetColorV = (texture2D(uX, vTextureCoord).g - normalizer ) * multiplier;
	targetColorV += uDt * sourceColorV;

	targetColorH = targetColorH / multiplier;
	targetColorH += normalizer;

	targetColorV = targetColorV / multiplier;
	targetColorV += normalizer;
	
    gl_FragColor = vec4(targetColorH, targetColorV, .5, 1.0);
  
}