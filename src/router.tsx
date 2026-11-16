import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    // Começa a baixar o código e os dados da rota quando o mouse para sobre o
    // link (ou o dedo toca), então o guia abre quase na hora no clique.
    defaultPreload: "intent",
    defaultPreloadStaleTime: 0,
  });

  return router;
};
