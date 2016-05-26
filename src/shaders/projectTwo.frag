precision highp float;

uniform sampler2D uVelHist;

uniform int uN;
uniform float multiplier;

varying vec2 vTextureCoord;

void main(void) {

	// r = div; g = p

	float color = .5;

	float h = 1.0 / (float(uN) + 2.0);

	float mult = multiplier;

	float divVal = texture2D(uVelHist, vTextureCoord).r;

	if (vTextureCoord.s > h && vTextureCoord.s < (1.0 - h)){
		if (vTextureCoord.t > h && vTextureCoord.t < (1.0 - h)){
			float topVal = (texture2D(uVelHist, vec2(vTextureCoord.s, vTextureCoord.t - h )).g -.5) * mult;
			float bottomVal = (texture2D(uVelHist, vec2(vTextureCoord.s, vTextureCoord.t + h)).g -.5) * mult;
			float leftVal = (texture2D(uVelHist, vec2(vTextureCoord.s - h, vTextureCoord.t)).g -.5) * mult;
			float rightVal = (texture2D(uVelHist, vec2(vTextureCoord.s + h, vTextureCoord.t)).g -.5) * mult;
			
			float multDivVal = (divVal - .5) * mult;
			float color = (multDivVal + leftVal + rightVal + topVal + bottomVal) / 4.0;

			
			color = color/mult;
			color += .5;
		}
	}


    gl_FragColor = vec4(divVal, color, .5, 1.0);
  
}