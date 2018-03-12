const mkdirp = require('mkdirp');
const log = require(process.cwd() + '/utils/debug');

const bootSetUp = () => {
    const rootPath = `${process.cwd()}/gallery`;
    const stagingPath = `${rootPath}/staging`;
    mkdirp(stagingPath);
};

module.exports = {
    dirSetUp: bootSetUp,
};
