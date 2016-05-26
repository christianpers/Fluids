precision mediump float;
varying vec2 vTextureCoord;
uniform sampler2D uTexturePos;

void main(void) {
    gl_FragColor = texture2D(uTexturePos, vec2(vTextureCoord.s, vTextureCoord.t));
    // gl_FragColor = vec4(0.0, 0.8, 0.0, 1.0);
}