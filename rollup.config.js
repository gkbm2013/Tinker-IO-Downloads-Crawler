import { babel } from "@rollup/plugin-babel";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import * as fs from "fs";

const extensions = [".ts", ".js"];

const preventTreeShakingPlugin = () => {
    return {
        name: "no-treeshaking",
        resolveId(id, importer) {
            if (!importer) {
                // let's not treeshake entry points, as we're not exporting anything in App Scripts
                return { id, moduleSideEffects: "no-treeshake" };
            }
            return null;
        }
    };
};

const plugins = [
    preventTreeShakingPlugin(),
    nodeResolve({
        extensions,
        mainFields: ["jsnext:main", "main"]
    }),
    babel({ extensions, babelHelpers: "runtime" }),
    commonjs(),
];

const createConfig = (filename) => ({
    input: `src/${filename}`,
    output: {
        dir: "build",
        format: "cjs",
    },
    plugins,
});

// Source: https://github.com/jaebradley/example-rollup-library/blob/master/rollup.config.js
const configs = fs.readdirSync("./src", { withFileTypes: true }).filter(dirent => dirent.isFile()).map(dirent => dirent.name).map((filename) => createConfig(filename));


export default configs;
