// module.exports = {
//     testEnvironment: 'node',
//     // 必要に応じて、他の設定を追加できます
// };

module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    transform: {
      '^.+\\.(ts|tsx)$': 'ts-jest',
    },
    transformIgnorePatterns: ['./node_modules/'],
};
