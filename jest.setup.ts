import "@testing-library/jest-dom";
import "whatwg-fetch";
import { loadEnvConfig } from "@next/env";

const projectDir = process.cwd();
loadEnvConfig(projectDir);
