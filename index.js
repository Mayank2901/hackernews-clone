require('ignore-styles');

require("regenerator-runtime/runtime");

require('@babel/register')({
    "presets": [
        "@babel/preset-env",
        "@babel/preset-react"
    ],
    "plugins": [
        [
          "transform-assets",
          {
            "extensions": [
              "css",
              "svg"
            ],
            "name": "static/media/[name].[hash:8].[ext]"
          }
        ]
    ]
})

require('./server')