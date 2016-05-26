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

	

	float N = float(uN);

	float a = uDt * uDiff * N * N;

	float textureOffset = 1.0 / (N + 2.0);

	float diffuse = .5;

	// float multiplier = 2.0;
	float normalizer = 0.5;
	float divider = 1.0;

	if (vTextureCoord.s > textureOffset && vTextureCoord.s < (1.0 - textureOffset)){
		if (vTextureCoord.t > textureOffset && vTextureCoord.t < (1.0 - textureOffset)){
			float topVal = ((texture2D(uX, vec2(vTextureCoord.s, vTextureCoord.t - textureOffset )).r -normalizer) * multiplier)/divider;
			float bottomVal = ((texture2D(uX, vec2(vTextureCoord.s, vTextureCoord.t + textureOffset)).r -normalizer) * multiplier)/divider;
			float leftVal = ((texture2D(uX, vec2(vTextureCoord.s - textureOffset, vTextureCoord.t)).r -normalizer) * multiplier)/divider;
			float rightVal = ((texture2D(uX, vec2(vTextureCoord.s + textureOffset, vTextureCoord.t)).r -normalizer) * multiplier)/divider;
			float histVal = ((texture2D(uX0, vTextureCoord).r -normalizer) * multiplier)/divider;

			diffuse = (histVal + a * (topVal + bottomVal + leftVal + rightVal)) / (1.0 + 4.0 * a);

			
			diffuse = diffuse/multiplier;
			diffuse += normalizer;
			
		}
	}
	
	gl_FragColor = vec4(diffuse, diffuse, diffuse, 1.0);

}