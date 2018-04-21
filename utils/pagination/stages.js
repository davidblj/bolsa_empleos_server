
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

const group = (groupDef) => ({
    $group: groupDef
});

const count = () => ({
    $count: 'total_count'
});

module.exports = {
    match,
    skip,
    sort,
    limit,
    project,
    group,
    count
};
