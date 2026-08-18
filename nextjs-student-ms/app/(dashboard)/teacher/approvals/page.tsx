import {DashboardHeader} from "@/components/shared/DashboardHeader";
import {Card, CardHeader, CardTitle, CardContent} from "@/components/ui/Card";
import {createClient} from "@/lib/supabase/server";
import {ApprovalsTable} from "@/components/teacher/ApprovalsTable";

export default async function AccountApprovalsPage() {
    const supabase = await createClient();

    const {data, count} = await supabase
        .from('profiles')
        .select('*', {count: 'exact'})
        .eq("status", "pending")
        .order("created_at", {ascending: false})

    return (
        <div className="space-y-6">
            <DashboardHeader
                heading="Account Approvals"
                text="Review and approve newly registered user accounts before granting full portal access."
            />

            <Card className="p-4 sm:p-6">
                <CardHeader className="mb-3 sm:mb-4">
                    <CardTitle className="text-base sm:text-lg">Pending Registrations ({count || 0})</CardTitle>
                </CardHeader>
                <CardContent>
                    <ApprovalsTable initialUsers={data || []}/>
                </CardContent>
            </Card>
        </div>
    );
}
