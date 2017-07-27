import map from "./map";

const mapPath = (path) => v => {
  let ret;
  for (let p of path) {
    ret = v[p];
    if (!ret)
      break;
  }
  return ret;
};

function view(...path) {
  return map(mapPath(path));
}

export default view;