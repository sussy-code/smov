import { useQueryParam } from "@/hooks/useQueryParams";

export function useOverlayRouter(id: string) {
  const [route, setRoute] = useQueryParam("r");
  const routeParts = (route ?? "").split("/").filter((v) => v.length > 0);
  const routerActive = routeParts.length > 0 && routeParts[0] === id;
  const currentPage = routeParts[routeParts.length - 1] ?? "/";

  function navigate(path: string) {
    const newRoute = [id, ...path.split("/").filter((v) => v.length > 0)];
    setRoute(newRoute.join("/"));
  }

  function isActive(page: string) {
    if (page === "/") return true;
    const index = routeParts.indexOf(page);
    if (index === -1) return false; // not active
    if (index === routeParts.length - 1) return false; // active but latest route so shouldnt be counted as active
    return true;
  }

  function isCurrentPage(page: string) {
    return routerActive && page === currentPage;
  }

  function isLoaded(page: string) {
    if (page === "/") return true;
    return route.includes(page);
  }

  function isOverlayActive() {
    return routerActive;
  }

  function pageProps(page: string) {
    return {
      show: isCurrentPage(page),
      active: isActive(page),
    };
  }

  function close() {
    navigate("/");
  }

  return {
    isOverlayActive,
    navigate,
    close,
    isLoaded,
    isCurrentPage,
    pageProps,
    isActive,
  };
}
