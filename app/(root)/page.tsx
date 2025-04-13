import Image from "next/image";
import Link from "next/link";
import { Models } from "node-appwrite";

import ActionDropdown from "@/components/ActionDropdown";
import Chart from "@/components/Chart";
import { FormattedDateTime } from "@/components/FormattedDateTime";
import { Thumbnail } from "@/components/Thumbnail";
import { Separator } from "@/components/ui/separator";
import { getFiles, getTotalSpaceUsed } from "@/lib/actions/file.actions";
import { convertFileSize, getUsageSummary } from "@/lib/utils";
import TodoList from "@/components/TodoList";
import CloudNestUsers from "@/components/CloudNestUsers";

const Dashboard = async () => {
  const [files, totalSpace] = await Promise.all([
    getFiles({ types: [], limit: 10 }),
    getTotalSpaceUsed(),
  ]);

  const usageSummary = getUsageSummary(totalSpace);

  return (
    <div className="flex h-full flex-col gap-8 p-6">
      {/* Storage Overview Section */}
      <section className="glass-card rounded-[20px] p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <h2 className="h3 text-white">Storage Used</h2>
            <p className="body-2 text-white/70">Manage More, Stress Less.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="glass-card rounded-full px-4 py-2">
              <p className="body-2 text-white">Total: 2GB</p>
            </div>
            <div className="glass-card rounded-full px-4 py-2">
              <p className="body-2 text-white">Used: {convertFileSize(totalSpace.used)}</p>
            </div>
          </div>
        </div>
        <div className="mt-6">
          <Chart used={totalSpace.used} />
        </div>
      </section>
      
      {/* Quick Tasks Section */}
      <TodoList />

      {/* File Type Summary Section */}
      <section className="grid gap-6 lg:grid-cols-2"> 
        <div className="glass-card rounded-[20px] p-6">
          <h3 className="h4 mb-6 text-white">File Summary</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {usageSummary.map((summary) => (
              <Link
                href={summary.url}
                key={summary.title}
                className="glass-card group rounded-xl p-4 transition-all duration-300 hover:scale-[1.02]"
              >
                <div className="flex items-center gap-4">
                  <div className="glass-card rounded-lg p-2">
                    <Image
                      src={summary.icon}
                      width={40}
                      height={40}
                      alt={summary.title}
                      className="transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="subtitle-2 text-white">{summary.title}</h4>
                    <p className="body-2 text-white/70">{convertFileSize(summary.size) || 0}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Files Section */}
        <div className="glass-card rounded-[20px] p-6">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="h4 text-white">Recent Files</h3>
            <Link href="/files" className="body-2 text-white/70 hover:text-white">
              View All
            </Link>
          </div>
          {files.documents.length > 0 ? (
            <div className="space-y-4">
              {files.documents.map((file: Models.Document) => (
                <Link
                  href={file.url}
                  target="_blank"
                  key={file.$id}
                  className="glass-card group flex items-center gap-4 rounded-xl p-4 transition-all duration-300 hover:scale-[1.02]"
                >
                  <Thumbnail
                    type={file.type}
                    extension={file.extension}
                    url={file.url}
                  />
                  <div className="flex-1">
                    <p className="subtitle-2 line-clamp-1 text-white">{file.name}</p>
                    <FormattedDateTime
                      date={file.$createdAt}
                      className="body-2 text-white/70"
                    />
                  </div>
                  <ActionDropdown file={file} />
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex h-[200px] items-center justify-center">
              <p className="body-2 text-white/60">No files uploaded yet</p>
            </div>
          )}
        </div>
      </section>

      {/* Cloud Nest Users Section */}
      <CloudNestUsers />

    </div>
  );
};

export default Dashboard;
