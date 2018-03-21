const mkdirp = require('mkdirp');

const bootSetUp = () => {
    const rootPath = `${process.cwd()}/gallery`;
    const stagingPath = `${rootPath}/staging`;
    mkdirp(stagingPath);
};

module.exports = {
    dirSetUp: bootSetUp,
};
