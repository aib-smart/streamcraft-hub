import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        toast({
          title: "Welcome!",
          description: "You have successfully signed in.",
        });
        navigate("/jstreamz");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, toast]);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-8 md:mt-12">
      <div className="max-w-md mx-auto">
        <h1 className="text-xl sm:text-2xl font-bold mb-6 text-center">Yo, Welcome Back!</h1>
        <div className="bg-card p-4 sm:p-6 rounded-lg shadow-lg">
          <SupabaseAuth 
            supabaseClient={supabase}
            appearance={{ 
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: 'rgb(0, 123, 255)',
                    brandAccent: 'rgb(255, 255, 255)',
                    defaultButtonBackground: 'rgb(0, 123, 255)',
                    defaultButtonText: 'rgb(255, 255, 255)',
                    defaultButtonBackgroundHover: 'rgb(4, 76, 154)',
                    inputText: 'rgb(0, 0, 0)',
                    inputBackground: 'rgb(255, 255, 255)',
                    inputBorder: 'rgb(200, 200, 200)',
                    inputBorderHover: 'rgb(0, 123, 255)',
                    anchorTextColor: 'rgb(0, 123, 255)',
                    anchorTextHoverColor: 'rgb(8, 92, 182)',
                  }
                },
              },
            }}
            providers={[]}
          />
        </div>
      </div>
    </div>
  );
};

export default Auth;