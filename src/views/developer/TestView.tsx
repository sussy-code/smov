import { Button } from "@/components/Button";
import { FloatingAnchor } from "@/components/popout/FloatingAnchor";
import {
  FloatingCardView,
  PopoutFloatingCard,
} from "@/components/popout/FloatingCard";
import { FloatingContainer } from "@/components/popout/FloatingContainer";
import { FloatingView } from "@/components/popout/FloatingView";
import { useFloatingRouter } from "@/hooks/useFloatingRouter";
import { useEffect, useRef, useState } from "react";

// simple empty view, perfect for putting in tests
export function TestView() {
  const [show, setShow] = useState(false);
  const { pageProps, navigate } = useFloatingRouter();
  const [left, setLeft] = useState(600);
  const direction = useRef(1);

  useEffect(() => {
    const step = 0;
    const interval = setInterval(() => {
      setLeft((v) => {
        const newVal = v + direction.current * step;
        if (newVal > window.innerWidth || newVal < 0) {
          direction.current *= -1;
        }
        return v + direction.current * step;
      });
    }, 10);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div
      className="relative h-[800px] w-full rounded border border-white bg-cover"
      style={{
        backgroundImage: `url(https://media4.giphy.com/media/jnhXd7KT8UTk5WIgiV/giphy.gif)`,
      }}
    >
      <FloatingContainer show={show} onClose={() => setShow(false)}>
        <PopoutFloatingCard for="test" onClose={() => setShow(false)}>
          <FloatingView {...pageProps("/")} width={400}>
            <FloatingCardView.Header
              title="Seasons"
              description="Choose which season you want to watch"
              goBack={() => setShow(false)}
              close
              action={<a href="#">Do something</a>}
            />
            <FloatingCardView.Content>
              <p>Hello world</p>
              <Button onClick={() => navigate("/second")}>Next</Button>
            </FloatingCardView.Content>
          </FloatingView>
          <FloatingView {...pageProps("second")} height={300} width={500}>
            <FloatingCardView.Header
              title="Seasons"
              description="Choose which season you want to watch"
              goBack={() => navigate("/")}
              action={<a href="#">Do something</a>}
            />
            <FloatingCardView.Content>
              <p>Hello world</p>
              <p onClick={() => navigate("/second")}>Click to go brrr</p>
              <Button onClick={() => navigate("/")}>Previous</Button>
              <Button onClick={() => navigate("/second/third")}>Next</Button>
            </FloatingCardView.Content>
          </FloatingView>
          <FloatingView {...pageProps("third")} height={300} width={500}>
            <Button onClick={() => navigate("/second")}>Previous</Button>
          </FloatingView>
        </PopoutFloatingCard>
      </FloatingContainer>
      <div
        className="absolute bottom-0"
        style={{
          left: `${left}px`,
        }}
      >
        <FloatingAnchor id="test">
          <div
            className="h-8 w-8 bg-white"
            onClick={() => setShow((v) => !v)}
          />
        </FloatingAnchor>
      </div>
    </div>
  );
}
