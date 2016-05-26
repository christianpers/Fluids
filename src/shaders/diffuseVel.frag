precision highp float;

uniform sampler2D uX;
uniform sampler2D uX0;

// uniform float uSource;
uniform int uN;
uniform int uB;
uniform float uDiff;
uniform float uDt;
uniform float multiplier;

varying vec2 vTextureCoord;

void main(void) {

	//r = horizontal, g = vertical

	float N = float(uN);

	float a = uDt * uDiff * N * N;

	float textureOffset = 1.0 / (N + 2.0);

	float diffuseH = .5;
	float diffuseV = .5;

	// float multiplier = 2.0;
	float normalizer = 0.5;
	
	if (vTextureCoord.s > textureOffset && vTextureCoord.s < (1.0 - textureOffset)){
		if (vTextureCoord.t > textureOffset && vTextureCoord.t < (1.0 - textureOffset)){
			
			vec2 topVal = texture2D(uX, vec2(vTextureCoord.s, vTextureCoord.t - textureOffset)).rg;
			vec2 bottomVal = texture2D(uX, vec2(vTextureCoord.s, vTextureCoord.t + textureOffset)).rg;
			vec2 leftVal = texture2D(uX, vec2(vTextureCoord.s - textureOffset, vTextureCoord.t)).rg;
			vec2 rightVal = texture2D(uX, vec2(vTextureCoord.s + textureOffset, vTextureCoord.t)).rg;
			vec2 histVal = texture2D(uX0, vTextureCoord).rg;

			float topValH = (topVal.r - normalizer) * multiplier;
			float bottomValH = (bottomVal.r - normalizer) * multiplier;
			float leftValH = (leftVal.r - normalizer) * multiplier;
			float rightValH = (rightVal.r - normalizer) * multiplier;
			float histValH = (histVal.r - normalizer) * multiplier;

			float topValV = (topVal.g - normalizer) * multiplier;
			float bottomValV = (bottomVal.g - normalizer) * multiplier;
			float leftValV = (leftVal.g - normalizer) * multiplier;
			float rightValV = (rightVal.g - normalizer) * multiplier;
			float histValV = (histVal.g - normalizer) * multiplier;

			diffuseH = (histValH + a * (topValH + bottomValH + leftValH + rightValH)) / (1.0 + 4.0 * a);

			diffuseH = diffuseH/multiplier;
			diffuseH += normalizer;


			diffuseV = (histValV + a * (topValV + bottomValV + leftValV + rightValV)) / (1.0 + 4.0 * a);

			diffuseV = diffuseV/multiplier;
			diffuseV += normalizer;
			
		}
	}
	
	gl_FragColor = vec4(diffuseH, diffuseV, .5, 1.0);

}