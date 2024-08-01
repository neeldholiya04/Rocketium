
function removeDuplicates(data, key) {
    const seen = new Set();
    return data.filter(item => {
        const k = item[key];
        return seen.has(k) ? false : seen.add(k);
    });
}

module.exports = removeDuplicates;
