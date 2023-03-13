import { useLayoutEffect, useState } from "react";

export function useFloatingRouter(initial = "/") {
  const [route, setRoute] = useState<string[]>(
    initial.split("/").filter((v) => v.length > 0)
  );
  const [previousRoute, setPreviousRoute] = useState(route);
  const currentPage = route[route.length - 1] ?? "/";

  useLayoutEffect(() => {
    if (previousRoute.length === route.length) return;
    // when navigating backwards, we delay the updating by a bit so transitions can be applied correctly
    setTimeout(() => {
      setPreviousRoute(route);
    }, 20);
  }, [route, previousRoute]);

  function navigate(path: string) {
    const newRoute = path.split("/").filter((v) => v.length > 0);
    if (newRoute.length > previousRoute.length) setPreviousRoute(newRoute);
    setRoute(newRoute);
  }

  function isActive(page: string) {
    if (page === "/") return true;
    const index = previousRoute.indexOf(page);
    if (index === -1) return false; // not active
    if (index === previousRoute.length - 1) return false; // active but latest route so shouldnt be counted as active
    return true;
  }

  function isCurrentPage(page: string) {
    return page === currentPage;
  }

  function isLoaded(page: string) {
    if (page === "/") return true;
    return route.includes(page);
  }

  function pageProps(page: string) {
    return {
      show: isCurrentPage(page),
      active: isActive(page),
    };
  }

  function reset() {
    navigate("/");
  }

  return {
    navigate,
    reset,
    isLoaded,
    isCurrentPage,
    pageProps,
    isActive,
  };
}
