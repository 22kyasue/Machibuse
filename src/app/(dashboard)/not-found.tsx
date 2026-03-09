import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function DashboardNotFound() {
  return (
    <div className="flex items-center justify-center py-20">
      <Card className="max-w-md">
        <CardContent className="text-center py-8">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
            <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="mb-2 text-lg font-semibold text-gray-900">
            ページが見つかりません
          </h2>
          <p className="mb-4 text-sm text-gray-500">
            お探しのページは存在しないか、移動した可能性があります。
          </p>
          <Link href="/dashboard">
            <Button>ダッシュボードに戻る</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
