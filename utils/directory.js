const mkdirp = require('mkdirp');

const bootSetUp = () => {
    const rootPath = `${process.cwd()}`;
    const galleryStagingPath = `${rootPath}/gallery/staging`;
    const resumesStagingPath = `${rootPath}/resumes/staging`;

    mkdirp(galleryStagingPath);
    mkdirp(resumesStagingPath);
};

module.exports = {
    bootSetUp: bootSetUp,
};
