/**
* Returns an array with arrays of the given size.
*
* @param anArray {Array} array to split
* @param chunk_size {Integer} Size of every group
*/
export function chunkArray(anArray, chunk_size, fixedSize = false) {
  let index = 0;
  let arrayLength = anArray.length;
  let tempArray = [];

  for (index = 0; index < arrayLength; index += chunk_size) {
    const myChunk = anArray.slice(index, index + chunk_size);
    // Do something if you want with the group
    if (myChunk.length < 5 && fixedSize) {
      const fillNumber = chunk_size - myChunk.length;
      for (let innerIndex = 0; innerIndex < fillNumber; innerIndex ++) {
        myChunk.push(null);
      }
    }
    tempArray.push(myChunk);
  }
  return tempArray;
}