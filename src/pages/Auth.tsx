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
    <div className="container max-w-md mx-auto mt-8 p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Yo, Welcome Back!</h1>
      <div className="bg-card p-6 rounded-lg shadow-lg">
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
                  inputBackground: 'rgb(255, 255, 255)',
                  inputText: 'rgb(0, 0, 0)',
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
  );
};

export default Auth;