export interface ProjectSpecs {
    voltage?: string;
    current?: string;
    type?: string;
    [key: string]: string | undefined;
}

export interface Project {
    id: string;
    title: string;
    description: string;
    thumbnail: string;
    images: string[];
    specs?: ProjectSpecs;
    date?: string;
    client?: string;
    modelUrl?: string;
    type?: string;
}
