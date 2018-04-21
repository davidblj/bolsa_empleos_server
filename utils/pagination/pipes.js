const {
    match,
    skip,
    sort,
    limit,
    project,
    group } = require('./stages');
let mongoose = require('mongoose');


const projectionPipe = () => {
    return [
        project({ id: 1, name: 1, owner: 1, salary: 1 })
    ]
};

const getSizePipe = () => {

    return [
        group({
            _id: null,
            total_count: { $sum: 1}
        })
    ]
};

const initPaging = (pageSize) => {

    return [
        sort({_id: -1}),
        limit(pageSize)
    ];
};

const goForward = (matchCondition, pageJump, pageSize) => {

    return [
        match(matchCondition),
        sort({_id: -1}),
        skip(pageJump*pageSize),
        limit(pageSize)
    ];
};

const goBackwards = (matchCondition, pageJump, pageSize) => {

    return [
        match(matchCondition),
        skip( (pageJump - 1)*pageSize ),
        limit(pageSize),
        sort({_id: -1})
    ];
};

const mostRecentPagingPipe = (currentId, offset, pageSize) => {

    if (!currentId) {
        return initPaging(pageSize);
    } else {
        currentId = new mongoose.Types.ObjectId(currentId.toString());
    }

    let forwardCondition = {_id: { $lte: currentId}},
        backwardsCondition = {_id: { $gt: currentId}},
        pageJump;

    if (offset > 0) {
        pageJump = offset;
        return goForward(forwardCondition, pageJump, pageSize);
    } else {
        pageJump = -offset;
        return goBackwards(backwardsCondition, pageJump, pageSize)
    }
};


module.exports = {
    getSizePipe,
    mostRecentPagingPipe,
    projectionPipe
};
