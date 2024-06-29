import { useFolderPath } from "@/context/fileAndFolderContext";
import Link from "next/link";
import { Fragment } from "react";

export default function BreadCrumb() {

    const path: any = useFolderPath();

    return <div className="px-2 gap-1 flex items-center">
        <Link href={'/home'}>
            <img src="/img/home.png" alt="" />
        </Link>

        {

            !path.length
                ?

                <p className="font-semibold text-2xl">/</p>
                :
                path.map((element: string) => {

                    const name = element.split('/')[0];
                    const id = element.split('/')[1];

                    return <Fragment key={id}>
                        <p className="font-semibold text-xl">/</p>

                        <Link href={id}
                            className="font-medium text-lg"
                        >
                            {name}
                        </Link>
                    </Fragment>

                })}
    </div>
}