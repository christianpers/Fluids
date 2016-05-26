precision highp float;

uniform sampler2D uVel;

uniform int uN;
uniform float multiplier;

varying vec2 vTextureCoord;

void main(void) {

	float color = .5;

	float h = 1.0 / (float(uN) + 2.0);

	float mult = multiplier;

	if (vTextureCoord.s > h && vTextureCoord.s < (1.0 - h)){
		if (vTextureCoord.t > h && vTextureCoord.t < (1.0 - h)){
			float topVal = (texture2D(uVel, vec2(vTextureCoord.s, vTextureCoord.t - h )).g - .5) * mult;
			float bottomVal = (texture2D(uVel, vec2(vTextureCoord.s, vTextureCoord.t + h)).g -.5) * mult;
			float leftVal = (texture2D(uVel, vec2(vTextureCoord.s - h, vTextureCoord.t)).r -.5) * mult;
			float rightVal = (texture2D(uVel, vec2(vTextureCoord.s + h, vTextureCoord.t)).r -.5) * mult;
			
			color = -.5 * (leftVal - rightVal + topVal - bottomVal) / float(uN);

			color = color/mult;
			color += .5;
		}
	}

	// r = div; g = p
    gl_FragColor = vec4(color, 0.5, .5, 1.0);  
}