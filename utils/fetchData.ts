export const fetchData = <TData, TVariables>(
  query: string,
  variables?: TVariables,
): (() => Promise<TData>) => {
  return async () => {
    const res = await fetch("https://gql.hashnode.com", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        query,
        variables,
      }),
    });
    if (!res.ok) {
      throw new Error(`HTTP status code: ${res.status}`);
    }

    const json = await res.json();

    if (json.errors) {
      const { message } = json.errors[0] || {};
      throw new Error(message || "Error…");
    }

    return json.data;
  };
};
