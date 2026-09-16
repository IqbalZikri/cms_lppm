import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Form } from "@inertiajs/react";
import { route } from "ziggy-js";
import { Field, FieldGroup } from "./ui/field";
import { Label } from "./ui/label";

export default function DialogFormCreate(
    page: string,
    route: any,
    input: object,
) {
    const [open, setOpen] = useState(false);
    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button type="button" className="w-[200px]">
                        Tambah {page}
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <Form
                        action={route(route)}
                        method="POST"
                        onSuccess={() => setOpen(false)}
                        resetOnSuccess
                    >
                        {(input) => {
                            <>
                                <FieldGroup>
                                    <Field>
                                        <Label htmlFor={input}>

                                        </Label>
                                    </Field>
                                </FieldGroup>
                            </>;
                        }}
                    </Form>
                    <DialogHeader></DialogHeader>
                </DialogContent>
            </Dialog>
        </>
    );
}
