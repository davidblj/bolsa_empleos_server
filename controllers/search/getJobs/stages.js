
const match = (condition) => ({
    $match: condition
});

const skip = (size) => ({
    $skip: parseInt(size)
});

const sort = (condition) => ({
    $sort: condition
});

const limit = (size) => ({
    $limit: parseInt(size)
});

const project = (projection) => ({
   $project: projection
});

module.exports = {
    match,
    skip,
    sort,
    limit,
    project
};
