module.exports = {
  style: {
    postcss: {
      plugins: [
        require('postcss-flexbugs-fixes'),
        require('postcss-preset-env')({
          autoprefixer: {
            flexbox: 'no-2009'
          },
          stage: 3
        }),
        require('tailwindcss'),
        require('autoprefixer')
      ]
    }
  },
  webpack: {
    configure: {
      module: {
        rules: [
          {
            test: /\.css$/,
            use: [
              {
                loader: 'postcss-loader',
                options: {
                  postcssOptions: {
                    ident: 'postcss',
                    config: false,
                    plugins: [
                      'postcss-flexbugs-fixes',
                      [
                        'postcss-preset-env',
                        {
                          autoprefixer: {
                            flexbox: 'no-2009',
                          },
                          stage: 3,
                        },
                      ],
                      'tailwindcss',
                      'autoprefixer',
                    ],
                  },
                },
              },
            ],
          },
        ],
      },
    },
  },
}; 