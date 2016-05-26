precision highp float;

uniform sampler2D uVel;
uniform sampler2D uVelHist;

uniform int uN;
uniform float multiplier;

varying vec2 vTextureCoord;

void main(void) {

	// r = div; g = p

	float currentHorizontal = .5;
	float currentVertical = .5;

	float h = 1.0 / (float(uN) + 2.0);

	float mult = multiplier;

	if (vTextureCoord.s > h && vTextureCoord.s < (1.0 - h)){
		if (vTextureCoord.t > h && vTextureCoord.t < (1.0 - h)){
			float topVal = (texture2D(uVelHist, vec2(vTextureCoord.s, vTextureCoord.t - h )).g -.5) * mult;
			float bottomVal = (texture2D(uVelHist, vec2(vTextureCoord.s, vTextureCoord.t + h)).g -.5) * mult;
			float leftVal = (texture2D(uVelHist, vec2(vTextureCoord.s - h, vTextureCoord.t)).g -.5) * mult;
			float rightVal = (texture2D(uVelHist, vec2(vTextureCoord.s + h, vTextureCoord.t)).g -.5) * mult;
			currentHorizontal = (texture2D(uVel, vTextureCoord).r - .5) * mult;
			currentVertical = (texture2D(uVel, vTextureCoord).g - .5) * mult;
			
			currentHorizontal -= .5 * float(uN) * (rightVal - leftVal);
			currentVertical -= .5 * float(uN) * (bottomVal - topVal);

			currentHorizontal = currentHorizontal / mult;
			currentHorizontal += .5;

			currentVertical = currentVertical / mult;
			currentVertical += .5;
		}
	}

    gl_FragColor = vec4(currentHorizontal, currentVertical, .5, 1.0);
  
}