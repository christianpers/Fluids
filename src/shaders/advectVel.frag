precision highp float;

uniform sampler2D uD;
uniform sampler2D uD0;

uniform int uN;
uniform float uDt;
uniform float multiplier;

varying vec2 vTextureCoord;

void main(void) {
	//horizontal = r, vertical = g;
	

	float N = float(uN);

	float textureOffset = 1.0 / (N + 2.0);

	// float multiplier = 2.0;
	float normalizer = 0.5;

	int i,j,k;
	float dt0 = uDt * N;
	// float dt0 = uDt;

	float colorH = normalizer;
	float colorV = normalizer;

	if (vTextureCoord.s > textureOffset && vTextureCoord.s < (1.0 - textureOffset)){
		if (vTextureCoord.t > textureOffset && vTextureCoord.t < (1.0 - textureOffset)){

			float i = vTextureCoord.s * N;
			float j = vTextureCoord.t * N;
			float velU = (texture2D(uD0, vTextureCoord).r - normalizer) * multiplier;
			float velV = (texture2D(uD0, vTextureCoord).g - normalizer) * multiplier;
			
			float x = i - dt0 * velU;
			float y = j - dt0 * velV;
			if (x < .5) x = .5;
			if (x > N + .5) x = N + .5;
			float i0 = x;
			float i1 = i0 + 1.0;

			if (y < .5) y = .5;
			if (y > N + .5) y = N + .5;
			float j0 = y;
			float j1 = j0 + 1.0;

			float s1 = x-i0;
			float s0 = 1.0 - s1;
			float t1 = y - j0;
			float t0 = 1.0 - t1;

			float Nadj = N + 2.0;
			vec2 topLeft = texture2D(uD0, vec2(i0/Nadj, j0/Nadj)).rg;
			vec2 bottomLeft = texture2D(uD0, vec2(i0/Nadj, j1/Nadj)).rg;
			vec2 topRight = texture2D(uD0, vec2(i1/Nadj, j0/Nadj)).rg;
			vec2 bottomRight = texture2D(uD0, vec2(i1/Nadj, j1/Nadj)).rg;
		
			float topLeftH = (topLeft.r - normalizer) * multiplier;
			float bottomLeftH = (bottomLeft.r - normalizer) * multiplier;
			float topRightH = (topRight.r - normalizer) * multiplier;
			float bottomRightH = (bottomRight.r - normalizer) * multiplier;

			float topLeftV = (topLeft.g - normalizer) * multiplier;
			float bottomLeftV = (bottomLeft.g - normalizer) * multiplier;
			float topRightV = (topRight.g - normalizer) * multiplier;
			float bottomRightV = (bottomRight.g - normalizer) * multiplier;

			colorH = s0 * (t0 * topLeftH + t1 * bottomLeftH) + s1 * (t0 * topRightH + t1 * bottomRightH);
			
			colorH = colorH / multiplier;
			colorH += normalizer;

			colorV = s0 * (t0 * topLeftV + t1 * bottomLeftV) + s1 * (t0 * topRightV + t1 * bottomRightV);
			
			colorV = colorV / multiplier;
			colorV += normalizer;

		}
	}

    gl_FragColor = vec4(colorH, colorV, .5, 1.0);
  
}