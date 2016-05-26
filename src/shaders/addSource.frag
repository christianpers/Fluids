precision highp float;

uniform sampler2D uX;
uniform sampler2D uS;

uniform int uN;
uniform float uDt;
uniform float multiplier;

varying vec2 vTextureCoord;

void main(void) {

	// float multiplier = 2.0;
	float normalizer = 0.5;

	float sourceColor = (texture2D(uS, vTextureCoord).r - normalizer ) * multiplier;
	float targetColor = (texture2D(uX, vTextureCoord).r - normalizer ) * multiplier;
	targetColor += uDt * sourceColor;

	
	targetColor = targetColor / multiplier;
	targetColor += normalizer;
	

    gl_FragColor = vec4(targetColor,targetColor,targetColor, 1.0);
  
}