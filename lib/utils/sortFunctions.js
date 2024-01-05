// sort by date
export const sortByDate = (array) => {
  return array.sort(
    (a, b) =>
      new Date(b.frontmatter.date && b.frontmatter.date) -
      new Date(a.frontmatter.date && a.frontmatter.date)
  );
};

// sort product by weight
export const sortByWeight = (array) => {
  const withWeight = array.filter((item) => item.frontmatter.weight);
  const withoutWeight = array.filter((item) => !item.frontmatter.weight);
  const sortedWeightedArray = withWeight.sort(
    (a, b) => a.frontmatter.weight - b.frontmatter.weight
  );
  return [...new Set([...sortedWeightedArray, ...withoutWeight])];
};
