const _ = require("lodash");
const categoryNumber = {
  Proezd: 1,
  Products: 2
};

// const k = 3;

// need much more records here. =()
const allRecords = [
  [11, 100, categoryNumber.Proezd],
  [10, 2430, categoryNumber.Products],
  [10, 200, categoryNumber.Proezd],
  [15, 1300, categoryNumber.Products],
  [5, 3430, categoryNumber.Proezd],
  [13, 150, categoryNumber.Proezd],
  [22, 430, categoryNumber.Products]
];

function runAnaylysis() {
  const testSetSize = 2;
  const [testSet, trainingSet] = splitDataset(minMax(allRecords, 2), testSetSize);
  // for each 'test' record, run knn using the 'training' data.
  // check if result equal.
  _.range(1, 15).forEach(k => {
    const accuracy = _.chain(testSet)
      .filter(testPoint => knn(trainingSet, _.initial(testPoint), k) === _.last(testPoint))
      .size()
      .divide(testSetSize)
      .value();

    console.log("Accuracy: ", accuracy, 'for k of ', k);
  });
  _.range(0, 2).forEach(feature => {
    const data = _.map(allRecords, row => [row[feature], _.last(row)]);
    const k = 3;
    const [testSet, trainingSet] = splitDataset(minMax(data, 1), testSetSize);
    const accuracy = _.chain(testSet)
      .filter(testPoint => knn(trainingSet, _.initial(testPoint), k) === _.last(testPoint))
      .size()
      .divide(testSetSize)
      .value();

    console.log("Accuracy: ", accuracy, 'for feature of ', feature);
  })
  // for (let i=0;i < testSet.length; i++) {
  //   const typeOfPayment = knn(trainingSet, testSet[i][0]);
  //   console.log(typeOfPayment, testSet[i][2]);
  //   if (typeOfPayment === testSet[i][2]) {
  //     numberCorrect++;
  //   }
  // }
  // console.log('Accuracy:', numberCorrect / testSetSize);
}
runAnaylysis();

function splitDataset(data, testCount) {
  const testSet = _.slice(data, 0, testCount);
  const trainingSet = _.slice(data, testCount);
  return [testSet, trainingSet];
}

// function distance(pointA, pointB) {
//   return Math.abs(pointA - pointB);
// }
function distance(pointAasArr, pointBasArr) {
  return _.chain(pointAasArr)
    .zip(pointBasArr)
    .map(([a, b]) => (a - b) ** 2)
    .sum()
    .value() ** 0.5
}

function knn(data, point, k) {
  // point has 3 values!!!
  return (
    _.chain(data)
      .map(row => {
        return [
            distance(_.initial(row), point), 
            _.last(row) 
          ]
      })
      .sortBy(row => row[0])
      .slice(0, k)
      // Look at the 'k' top records, take most common category
      .countBy(row => row[1])
      .toPairs()
      .sortBy(row => row[1])
      .last()
      .first()
      .parseInt()
      .value()
  );
}

function minMax(data, featureCount) {
  const cloneData = _.cloneDeep(data);
  for (let i=0; i< featureCount; i++) {
    const column = cloneData.map(row => row[i]);
    const min = _.min(column);
    const max = _.max(column);
    
    for (let j =0; j< cloneData.length; j++) {
      cloneData[j][i] = (cloneData[j][i] -min) / (max - min);
    }
  }
  console.log(cloneData);
  return cloneData;
}
