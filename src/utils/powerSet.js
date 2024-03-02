export function findSubsets(arr) {
    const subsets = []
    function backtrack(start, currentSubset) {
        subsets.push(currentSubset.slice())

        for (let i = start; i < arr.length; i++) {
            currentSubset.push(arr[i])
            backtrack(i + 1, currentSubset)
            currentSubset.pop()
        }
    }
    backtrack(0, [])
    return subsets
}
