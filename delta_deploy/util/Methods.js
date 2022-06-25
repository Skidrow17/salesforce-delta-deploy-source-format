/*
    author : Silvan Sholla
    date : 25/6/22
*/

const addValueToKey = (key, value, folderFileName) => {
    folderFileName[key] ??= [];
    folderFileName[key].push(value);
};

const splitOnce = (s, on) => {
    [first, ...rest] = s.split(on);
    return [first, rest.length > 0? rest.join(on) : null];
};

exports.splitOnce = splitOnce;
exports.addValueToKey = addValueToKey;