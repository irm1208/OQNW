import { useEffect, useState, type ComponentType } from "react";

type ModuleMap = Record<string, () => Promise<Record<string, unknown>>>;

const modules = import.meta.glob("./mockups/**/*.tsx") as ModuleMap;

function resolveComponent(
  mod: Record<string, unknown>,
  name: string,
): ComponentType | undefined {
  const functions = Object.values(mod).filter(
    (value) => typeof value === "function",
  ) as ComponentType[];

  return (
    (mod.default as ComponentType) ||
    (mod.Preview as ComponentType) ||
    (mod[name] as ComponentType) ||
    functions[functions.length - 1]
  );
}

function PreviewRenderer({
  componentPath,
}: {
  componentPath: string;
}) {
  const [component, setComponent] = useState<ComponentType | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setComponent(null);
    setError(null);

    async function load() {
      const loader = modules[`./mockups/${componentPath}.tsx`];
      if (!loader) {
        setError(`No component found at ${componentPath}.tsx`);
        return;
      }

      try {
        const mod = await loader();
        if (cancelled) return;
        const name = componentPath.split("/").pop() ?? "";
        const loaded = resolveComponent(mod, name);
        if (!loaded) {
          setError(`No React component exported from ${componentPath}.tsx`);
          return;
        }
        setComponent(() => loaded);
      } catch (cause) {
        if (!cancelled) {
          setError(cause instanceof Error ? cause.message : String(cause));
        }
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [componentPath]);

  if (error) {
    return <pre className="p-8 text-red-600">{error}</pre>;
  }
  if (!component) return null;
  const Component = component;
  return <Component />;
}

function getPreviewPath() {
  return window.location.hash.replace(/^#\/?/, "").replace(/\/$/, "") || null;
}

export default function App() {
  const [previewPath, setPreviewPath] = useState(getPreviewPath);

  useEffect(() => {
    const onHashChange = () => setPreviewPath(getPreviewPath());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  return previewPath ? (
    <PreviewRenderer componentPath={previewPath} />
  ) : (
    <div className="flex min-h-screen items-center justify-center bg-background p-8 text-foreground">
      <div className="oq-panel max-w-md p-8 text-center">
        <p className="oq-eyebrow">OmniQure Ops</p>
        <h1 className="mt-3 text-2xl font-bold">Design system preview</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Choose a foundations or mockup route from the canvas.
        </p>
      </div>
    </div>
  );
}