import combine from "./combine";
import filter from "./filter";
import pipe from "./pipe";
import view from "./view";

function toggle(trigger) {
  return pipe(
      combine((value, allow) => [!!allow, value], trigger),
      filter(([allow]) => allow),
      view(0)
    );
}

export default toggle;
