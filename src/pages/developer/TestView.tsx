import { useState } from "react";

import { Button } from "@/components/buttons/Button";

// mostly empty view, add whatever you need
export default function TestView() {
  const [val, setVal] = useState(false);

  if (val) throw new Error("I crashed");

  return <Button onClick={() => setVal(true)}>Crash me!</Button>;
}
