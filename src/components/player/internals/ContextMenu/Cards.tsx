export function Card(props: { children: React.ReactNode }) {
  return (
    <div className="h-full grid grid-rows-[1fr]">
      <div className="px-6 h-full flex flex-col justify-start overflow-y-auto overflow-x-hidden">
        {props.children}
      </div>
    </div>
  );
}

export function CardWithScrollable(props: { children: React.ReactNode }) {
  return (
    <div className="[&>*]:px-6 h-full grid grid-rows-[auto,1fr] [&>*:nth-child(2)]:overflow-y-auto [&>*:nth-child(2)]:overflow-x-hidden">
      {props.children}
    </div>
  );
}
